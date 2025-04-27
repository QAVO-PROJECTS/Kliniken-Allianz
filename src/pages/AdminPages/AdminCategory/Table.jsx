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
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useGetAllCategoryQuery } from "../../../services/userApi.jsx";
import { CATEGORY_IMAGES } from "../../../contants.js";
import {FaRegEdit} from "react-icons/fa";
import {MdDeleteForever} from "react-icons/md";

const CategoryTable = () => {
    const { data: getAllCategory } = useGetAllCategoryQuery();
    const categories = getAllCategory?.data || [];

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
        editForm.setFieldsValue({
            name: record.name,
            nameEng: record.nameEng,
            nameRu: record.nameRu,
            description: record.description,
            descriptionEng: record.descriptionEng,
            descriptionRu: record.descriptionRu,
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

    // Form submission handlers (stubbed)
    const handleAddCategory = (values) => {
        console.log("Add category:", values, cardFileList);
        // Implement API call to add category
        setIsAddModalVisible(false);
    };

    const handleEditCategory = (values) => {
        console.log("Edit category:", values, cardFileList);
        // Implement API call to update category
        setIsEditModalVisible(false);
    };

    // Delete handler (stubbed)
    const handleDelete = (id) => {
        console.log("Delete category:", id);
        // Implement API call to delete category
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

    // Expanded row rendering
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
        <div>
            <Button
                type="primary"
                onClick={showAddModal}
                style={{ marginBottom: 16 }}
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
            >
                <Form form={form} layout="vertical" onFinish={handleAddCategory}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="name"
                                label="Kateqoriya Adı (AZ)"
                                rules={[{ required: true, message: "Ad daxil edin!" }]}
                            >
                                <Input placeholder="Ad daxil edin" />
                            </Form.Item>
                            <Form.Item
                                name="nameEng"
                                label="Kateqoriya Adı (EN)"
                                rules={[{ required: true, message: "Ad daxil edin!" }]}
                            >
                                <Input placeholder="Ad daxil edin (EN)" />
                            </Form.Item>
                            <Form.Item
                                name="nameRu"
                                label="Kateqoriya Adı (RU)"
                                rules={[{ required: true, message: "Ad daxil edin!" }]}
                            >
                                <Input placeholder="Ad daxil edin (RU)" />
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
                                >
                                    {cardFileList.length < 1 && (
                                        <div>
                                            <PlusOutlined />
                                            <div style={{ marginTop: 8 }}>Şəkil əlavə et</div>
                                        </div>
                                    )}
                                </Upload>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="description"
                                label="Açıqlama (AZ)"
                                rules={[{ required: true, message: "Açıqlama daxil edin!" }]}
                            >
                                <Input.TextArea placeholder="Açıqlama daxil edin" />
                            </Form.Item>
                            <Form.Item
                                name="descriptionEng"
                                label="Açıqlama (EN)"
                                rules={[{ required: true, message: "Açıqlama daxil edin!" }]}
                            >
                                <Input.TextArea placeholder="Açıqlama daxil edin (EN)" />
                            </Form.Item>
                            <Form.Item
                                name="descriptionRu"
                                label="Açıqlama (RU)"
                                rules={[{ required: true, message: "Açıqlama daxil edin!" }]}
                            >
                                <Input.TextArea placeholder="Açıqlama daxil edin (RU)" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item style={{ textAlign: "right" }}>
                        <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
                            Əlavə Et
                        </Button>
                        <Button onClick={handleAddCancel}>İmtina Et</Button>
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
            >
                <Form form={editForm} layout="vertical" onFinish={handleEditCategory}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="name"
                                label="Kateqoriya Adı (AZ)"
                                rules={[{ required: true, message: "Ad daxil edin!" }]}
                            >
                                <Input placeholder="Ad daxil edin" />
                            </Form.Item>
                            <Form.Item
                                name="nameEng"
                                label="Kateqoriya Adı (EN)"
                                rules={[{ required: true, message: "Ad daxil edin!" }]}
                            >
                                <Input placeholder="Ad daxil edin (EN)" />
                            </Form.Item>
                            <Form.Item
                                name="nameRu"
                                label="Kateqoriya Adı (RU)"
                                rules={[{ required: true, message: "Ad daxil edin!" }]}
                            >
                                <Input placeholder="Ad daxil edin (RU)" />
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
                                >
                                    {cardFileList.length < 1 && (
                                        <div>
                                            <PlusOutlined />
                                            <div style={{ marginTop: 8 }}>Şəkil əlavə et</div>
                                        </div>
                                    )}
                                </Upload>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="description"
                                label="Açıqlama (AZ)"
                                rules={[{ required: true, message: "Açıqlama daxil edin!" }]}
                            >
                                <Input.TextArea placeholder="Açıqlama daxil edin" />
                            </Form.Item>
                            <Form.Item
                                name="descriptionEng"
                                label="Açıqlama (EN)"
                                rules={[{ required: true, message: "Açıqlama daxil edin!" }]}
                            >
                                <Input.TextArea placeholder="Açıqlama daxil edin (EN)" />
                            </Form.Item>
                            <Form.Item
                                name="descriptionRu"
                                label="Açıqlama (RU)"
                                rules={[{ required: true, message: "Açıqlama daxil edin!" }]}
                            >
                                <Input.TextArea placeholder="Açıqlama daxil edin (RU)" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item style={{ textAlign: "right" }}>
                        <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
                            Düzəliş Et
                        </Button>
                        <Button onClick={handleEditCancel}>İmtina Et</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CategoryTable;