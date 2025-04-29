import { useState } from "react";
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Upload,
    Popconfirm,
    Row,
    Col,
    Select,
    message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
    useDeleteCategoryMutation,
    useGetAllCategoryQuery,
    useGetAllServiceQuery,
    usePostCategoryMutation,
    usePutCategoryMutation,
} from "../../../services/userApi.jsx";
import { CATEGORY_IMAGES } from "../../../contants.js";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";

const CategoryTable = () => {
    const { data: getAllCategory, refetch: refetchCategories } = useGetAllCategoryQuery();
    const categories = getAllCategory?.data || [];
    const { data: getAllService } = useGetAllServiceQuery();
    const services = getAllService?.data || [];
    const [postCategory] = usePostCategoryMutation();
    const [putCategory] = usePutCategoryMutation();
    const [deleteCategory] = useDeleteCategoryMutation();
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();
    const [editingCategory, setEditingCategory] = useState(null);
    const [cardFileList, setCardFileList] = useState([]);

    // Modal handlers
    const showAddModal = () => {
        form.resetFields();
        setCardFileList([]);
        setIsAddModalVisible(true);
    };

    const showEditModal = (record) => {
        setEditingCategory(record);
        const serviceIds = record.services ? record.services.map((service) => service.id) : [];

        editForm.setFieldsValue({
            name: record.name,
            nameEng: record.nameEng,
            nameRu: record.nameRu,
            description: record.description,
            descriptionEng: record.descriptionEng,
            descriptionRu: record.descriptionRu,
            serviceIds: serviceIds,
        });
        setCardFileList(
            record.categoryImage
                ? [
                    {
                        uid: "-1",
                        name: record.categoryImage,
                        status: "done",
                        url: CATEGORY_IMAGES + record.categoryImage,
                    },
                ]
                : []
        );
        setIsEditModalVisible(true);
    };

    const handleAddCancel = () => {
        setIsAddModalVisible(false);
    };

    const handleEditCancel = () => {
        setIsEditModalVisible(false);
        setEditingCategory(null);
    };

    // Form submission handlers
    const handleAddCategory = async (values) => {
        try {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("nameEng", values.nameEng);
            formData.append("nameRu", values.nameRu);
            formData.append("description", values.description);
            formData.append("descriptionEng", values.descriptionEng);
            formData.append("descriptionRu", values.descriptionRu);
            if (values.serviceIds && Array.isArray(values.serviceIds)) {
                values.serviceIds.forEach((id) => {
                    formData.append("serviceIds", id);
                });
            }
            if (cardFileList[0]?.originFileObj) {
                formData.append("categoryImage", cardFileList[0].originFileObj);
            }

            await postCategory(formData).unwrap();
            message.success("Kateqoriya uğurla əlavə edildi!");
            setIsAddModalVisible(false);
            form.resetFields();
            setCardFileList([]);
            refetchCategories();
        } catch (error) {
            console.error("Kateqoriya əlavə edilərkən xəta:", error);
            message.error("Kateqoriya əlavə edilərkən xəta baş verdi!");
        }
    };

    const handleEditCategory = async (values) => {
        try {
            const formData = new FormData();
            formData.append("id", editingCategory.id);
            formData.append("name", values.name);
            formData.append("nameEng", values.nameEng);
            formData.append("nameRu", values.nameRu);
            formData.append("description", values.description);
            formData.append("descriptionEng", values.descriptionEng);
            formData.append("descriptionRu", values.descriptionRu);

            // Get the original service IDs
            const originalServiceIds = editingCategory.services
                ? editingCategory.services.map((service) => service.id)
                : [];

            // Get the updated service IDs from the form
            const updatedServiceIds = values.serviceIds || [];

            // Calculate deleted service IDs (services that were in original but not in updated)
            const deleteServiceIds = originalServiceIds.filter(
                (id) => !updatedServiceIds.includes(id)
            );

            // Only send serviceIds if they have changed
            if (
                values.serviceIds &&
                Array.isArray(values.serviceIds) &&
                JSON.stringify(values.serviceIds.sort()) !== JSON.stringify(originalServiceIds.sort())
            ) {
                values.serviceIds.forEach((id) => {
                    formData.append("serviceIds", id);
                });
            }

            // Send deleteServiceIds if there are any
            if (deleteServiceIds.length > 0) {
                deleteServiceIds.forEach((id) => {
                    formData.append("deleteServiceIds", id);
                });
            }

            // Add categoryImage if a new image is uploaded
            if (cardFileList[0]?.originFileObj) {
                formData.append("categoryImage", cardFileList[0].originFileObj);
            }

            await putCategory(formData).unwrap();
            message.success("Kateqoriya uğurla redaktə edildi!");
            setIsEditModalVisible(false);
            editForm.resetFields();
            setCardFileList([]);
            refetchCategories();
        } catch (error) {
            console.error("Kateqoriya redaktə edilərkən xəta:", error);
            message.error("Kateqoriya redaktə edilərkən xəta baş verdi!");
        }
    };

    // Delete handler
    const handleDelete = async (id) => {
        try {
            await deleteCategory(id).unwrap();
            message.success("Kateqoriya uğurla silindi!");
            refetchCategories();
        } catch (error) {
            console.error("Kateqoriya silinərkən xəta:", error);
            message.error("Kateqoriya silinərkən xəta baş verdi!");
        }
    };

    const columns = [
        {
            title: "#",
            dataIndex: "id",
            key: "id",
            render: (text, record, index) => <div>{index + 1}</div>,
        },
        {
            title: "Şəkil",
            dataIndex: "categoryImage",
            key: "categoryImage",
            render: (categoryImage) => {
                if (!categoryImage) return <span>No Image</span>;
                return (
                    <img
                        src={CATEGORY_IMAGES + categoryImage}
                        alt="Şəkil"
                        style={{ width: 50, height: 50, borderRadius: "5px", objectFit: "cover" }}
                    />
                );
            },
        },
        {
            title: "Kateqoriya adı",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Açıqlama",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Əməliyyatlar",
            key: "actions",
            render: (text, record) => (
                <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                    <Button type="primary" onClick={() => showEditModal(record)}>
                        <FaRegEdit />
                    </Button>
                    <Popconfirm
                        title="Silmək istədiyinizə əminsiniz?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Bəli"
                        cancelText="Xeyr"
                    >
                        <Button type="default" danger>
                            <MdDeleteForever />
                        </Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    const expandedRowRender = (record) => {
        const serviceColumns = [
            {
                title: "Xidmət Adı",
                dataIndex: "name",
                key: "name",
            },
            {
                title: "Açıqlama",
                dataIndex: "description",
                key: "description",
            },
            {
                title: "Şəkil",
                dataIndex: "serviceCardImage",
                key: "serviceCardImage",
                render: (serviceCardImage) =>
                    serviceCardImage ? (
                        <img
                            src={CATEGORY_IMAGES + serviceCardImage}
                            alt="Xidmət Şəkli"
                            style={{ width: 50, height: 50, borderRadius: "5px", objectFit: "cover" }}
                        />
                    ) : (
                        <span>No Image</span>
                    ),
            },
        ];

        return (
            <div>
                <h4>Əlavə Məlumat</h4>
                <Row gutter={16}>
                    <Col span={12}>
                        <p>
                            <strong>Ad (EN):</strong> {record.nameEng}
                        </p>
                        <p>
                            <strong>Ad (RU):</strong> {record.nameRu}
                        </p>
                    </Col>
                    <Col span={12}>
                        <p>
                            <strong>Açıqlama (EN):</strong> {record.descriptionEng}
                        </p>
                        <p>
                            <strong>Açıqlama (RU):</strong> {record.descriptionRu}
                        </p>
                    </Col>
                </Row>
                <h4>Xidmətlər</h4>
                <Table
                    columns={serviceColumns}
                    dataSource={record.services}
                    pagination={false}
                    rowKey="id"
                />
            </div>
        );
    };

    return (
        <div className="p-4">
            <Button
                type="primary"
                onClick={showAddModal}
                className="mb-4 bg-blue-500 hover:bg-blue-600"
            >
                +
            </Button>
            <Table
                rowKey="id"
                columns={columns}
                dataSource={categories}
                pagination={{ pageSize: 6 }}
                expandable={{
                    expandedRowRender,
                    rowExpandable: (record) =>
                        record.nameEng ||
                        record.nameRu ||
                        record.descriptionEng ||
                        record.descriptionRu ||
                        record.services.length > 0,
                }}
            />

            {/* Add Category Modal */}
            <Modal
                title="Yeni Kateqoriya Əlavə Et"
                visible={isAddModalVisible}
                onCancel={handleAddCancel}
                footer={null}
                width={800}
                className="rounded-lg"
            >
                <Form form={form} layout="vertical" onFinish={handleAddCategory}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="name"
                                label="Kateqoriya Adı (AZ)"
                                rules={[{ required: true, message: "Ad daxil edin!" }]}
                            >
                                <Input placeholder="Ad daxil edin" className="rounded-md" />
                            </Form.Item>
                            <Form.Item
                                name="nameEng"
                                label="Kateqoriya Adı (EN)"
                                rules={[{ required: true, message: "Ad daxil edin!" }]}
                            >
                                <Input placeholder="Ad daxil edin (EN)" className="rounded-md" />
                            </Form.Item>
                            <Form.Item
                                name="nameRu"
                                label="Kateqoriya Adı (RU)"
                                rules={[{ required: true, message: "Ad daxil edin!" }]}
                            >
                                <Input placeholder="Ad daxil edin (RU)" className="rounded-md" />
                            </Form.Item>
                            <Form.Item
                                name="serviceIds"
                                label="Xidmətlər"
                                rules={[{ required: true, message: "Xidmət seçin!" }]}
                            >
                                <Select
                                    mode="multiple"
                                    placeholder="Xidmətləri seçin"
                                    className="rounded-md"
                                    allowClear
                                    showSearch
                                    optionFilterProp="label"
                                >
                                    {services.map((service) => (
                                        <Select.Option
                                            key={service.id}
                                            value={service.id}
                                            label={service.name}
                                        >
                                            {service.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="description"
                                label="Açıqlama (AZ)"
                                rules={[{ required: true, message: "Açıqlama daxil edin!" }]}
                            >
                                <Input.TextArea
                                    placeholder="Açıqlama daxil edin"
                                    className="rounded-md"
                                    rows={4}
                                />
                            </Form.Item>
                            <Form.Item
                                name="descriptionEng"
                                label="Açıqlama (EN)"
                                rules={[{ required: true, message: "Açıqlama daxil edin!" }]}
                            >
                                <Input.TextArea
                                    placeholder="Açıqlama daxil edin (EN)"
                                    className="rounded-md"
                                    rows={4}
                                />
                            </Form.Item>
                            <Form.Item
                                name="descriptionRu"
                                label="Açıqlama (RU)"
                                rules={[{ required: true, message: "Açıqlama daxil edin!" }]}
                            >
                                <Input.TextArea
                                    placeholder="Açıqlama daxil edin (RU)"
                                    className="rounded-md"
                                    rows={4}
                                />
                            </Form.Item>
                            <Form.Item label="Şəkil">
                                <Upload
                                    name="categoryImage"
                                    listType="picture-card"
                                    fileList={cardFileList}
                                    beforeUpload={() => false}
                                    onChange={({ fileList }) => setCardFileList(fileList)}
                                    onRemove={(file) =>
                                        setCardFileList(cardFileList.filter((f) => f.uid !== file.uid))
                                    }
                                    className="rounded-md"
                                >
                                    {cardFileList.length < 1 && (
                                        <div>
                                            <PlusOutlined />
                                            <div className="mt-2">Şəkil əlavə et</div>
                                        </div>
                                    )}
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item className="text-right">
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="mr-2 bg-blue-500 hover:bg-blue-600 rounded-md"
                        >
                            Əlavə Et
                        </Button>
                        <Button onClick={handleAddCancel} className="rounded-md">
                            İmtina Et
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Edit Category Modal */}
            <Modal
                title="Kateqoriya Redaktə Et"
                visible={isEditModalVisible}
                onCancel={handleEditCancel}
                footer={null}
                width={800}
                className="rounded-lg"
            >
                <Form form={editForm} layout="vertical" onFinish={handleEditCategory}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="name"
                                label="Kateqoriya Adı (AZ)"
                                rules={[{ required: true, message: "Ad daxil edin!" }]}
                            >
                                <Input placeholder="Ad daxil edin" className="rounded-md" />
                            </Form.Item>
                            <Form.Item
                                name="nameEng"
                                label="Kateqoriya Adı (EN)"
                                rules={[{ required: true, message: "Ad daxil edin!" }]}
                            >
                                <Input placeholder="Ad daxil edin (EN)" className="rounded-md" />
                            </Form.Item>
                            <Form.Item
                                name="nameRu"
                                label="Kateqoriya Adı (RU)"
                                rules={[{ required: true, message: "Ad daxil edin!" }]}
                            >
                                <Input placeholder="Ad daxil edin (RU)" className="rounded-md" />
                            </Form.Item>
                            <Form.Item
                                name="serviceIds"
                                label="Xidmətlər"
                                rules={[{ required: true, message: "Xidmət seçin!" }]}
                            >
                                <Select
                                    mode="multiple"
                                    placeholder="Xidmətləri seçin"
                                    className="rounded-md"
                                    allowClear
                                    showSearch
                                    optionFilterProp="label"
                                >
                                    {services.map((service) => (
                                        <Select.Option
                                            key={service.id}
                                            value={service.id}
                                            label={service.name}
                                        >
                                            {service.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="description"
                                label="Açıqlama (AZ)"
                                rules={[{ required: true, message: "Açıqlama daxil edin!" }]}
                            >
                                <Input.TextArea
                                    placeholder="Açıqlama daxil edin"
                                    className="rounded-md"
                                    rows={4}
                                />
                            </Form.Item>
                            <Form.Item
                                name="descriptionEng"
                                label="Açıqlama (EN)"
                                rules={[{ required: true, message: "Açıqlama daxil edin!" }]}
                            >
                                <Input.TextArea
                                    placeholder="Açıqlama daxil edin (EN)"
                                    className="rounded-md"
                                    rows={4}
                                />
                            </Form.Item>
                            <Form.Item
                                name="descriptionRu"
                                label="Açıqlama (RU)"
                                rules={[{ required: true, message: "Açıqlama daxil edin!" }]}
                            >
                                <Input.TextArea
                                    placeholder="Açıqlama daxil edin (RU)"
                                    className="rounded-md"
                                    rows={4}
                                />
                            </Form.Item>
                            <Form.Item label="Şəkil">
                                <Upload
                                    name="categoryImage"
                                    listType="picture-card"
                                    fileList={cardFileList}
                                    beforeUpload={() => false}
                                    onChange={({ fileList }) => setCardFileList(fileList)}
                                    onRemove={(file) =>
                                        setCardFileList(cardFileList.filter((f) => f.uid !== file.uid))
                                    }
                                    className="rounded-md"
                                >
                                    {cardFileList.length < 1 && (
                                        <div>
                                            <PlusOutlined />
                                            <div className="mt-2">Şəkil əlavə et</div>
                                        </div>
                                    )}
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item className="text-right">
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="mr-2 bg-blue-500 hover:bg-blue-600 rounded-md"
                        >
                            Düzəliş Et
                        </Button>
                        <Button onClick={handleEditCancel} className="rounded-md">
                            İmtina Et
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CategoryTable;