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
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { useGetAllDoctorsQuery, useGetAllClinicQuery } from "../../../services/userApi.jsx";
import { DOCTOR_IMG_URL } from "../../../contants.js";

const DoktorTable = () => {
    const { data: getAllDoctors } = useGetAllDoctorsQuery();
    const { data: getAllClinic } = useGetAllClinicQuery();
    const doctors = getAllDoctors?.data || [];
    const clinics = getAllClinic?.data || [];

    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();
    const [editingDoctor, setEditingDoctor] = useState(null);
    const [cardFileList, setCardFileList] = useState([]);

    // Modal handlers
    const showAddModal = () => {
        form.resetFields();
        setCardFileList([]);
        setIsAddModalVisible(true);
    };

    const showEditModal = (record) => {
        setEditingDoctor(record);
        editForm.setFieldsValue({
            name: record.name,
            nameEng: record.nameEng,
            nameRu: record.nameRu,
            surName: record.surName,
            surNameEng: record.surNameEng,
            surNameRu: record.surNameRu,
            description: record.description,
            descriptionEng: record.descriptionEng,
            descriptionRu: record.descriptionRu,
            rate: record.rate,
            role: record.role,
            bornDate: record.bornDate,
            clinicId: record.clinicId,
            doctorSertificates: record.doctorSertificates,
            deleteDoctorSertificates: record.deleteDoctorSertificates,
        });
        setCardFileList(
            record.doctorImage
                ? [
                    {
                        uid: "-1",
                        name: record.doctorImage,
                        status: "done",
                        url: DOCTOR_IMG_URL + record.doctorImage,
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
        setEditingDoctor(null);
    };

    // Form submission handlers (stubbed)
    const handleAddDoctor = (values) => {
        console.log("Add doctor:", values, cardFileList);
        // Implement API call to add doctor
        setIsAddModalVisible(false);
    };

    const handleEditDoctor = (values) => {
        console.log("Edit doctor:", values, cardFileList);
        // Implement API call to update doctor
        setIsEditModalVisible(false);
    };

    // Delete handler (stubbed)
    const handleDelete = (id) => {
        console.log("Delete doctor:", id);
        // Implement API call to delete doctor
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
            dataIndex: "doctorImage",
            key: "doctorImage",
            render: (doctorImage) => {
                if (!doctorImage) return <span>No Image</span>;
                return (
                    <img
                        src={DOCTOR_IMG_URL + doctorImage}
                        alt="Şəkil"
                        style={{ width: 50, height: 50, borderRadius: "5px", objectFit: "cover" }}
                    />
                );
            },
        },
        {
            title: "Həkim adı",
            dataIndex: "name",
            key: "name",
            render: (name, record) => `${name} ${record.surName}`,
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
        const clinicName = clinics.find((clinic) => clinic.id === record.clinicId)?.name || "Bilinməyən Klinika";

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
                        <p>
                            <strong>Soyad (EN):</strong> {record.surNameEng}
                        </p>
                        <p>
                            <strong>Soyad (RU):</strong> {record.surNameRu}
                        </p>
                        <p>
                            <strong>Açıqlama (EN):</strong> {record.descriptionEng}
                        </p>
                        <p>
                            <strong>Açıqlama (RU):</strong> {record.descriptionRu}
                        </p>
                    </Col>
                    <Col span={12}>
                        <p>
                            <strong>Reytinq:</strong> {record.rate.toFixed(2)}
                        </p>
                        <p>
                            <strong>Rol:</strong> {record.role}
                        </p>
                        <p>
                            <strong>Doğum Tarixi:</strong> {record.bornDate}
                        </p>
                        <p>
                            <strong>Klinika:</strong> {clinicName}
                        </p>
                        <p>
                            <strong>Sertifikatlar:</strong>{" "}
                            {record.doctorSertificates.length > 0
                                ? record.doctorSertificates.join(", ")
                                : "Sertifikat yoxdur"}
                        </p>
                    </Col>
                </Row>
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
                dataSource={doctors}
                pagination={{ pageSize: 6 }}
                expandable={{
                    expandedRowRender,
                    rowExpandable: (record) =>
                        record.nameEng ||
                        record.nameRu ||
                        record.surNameEng ||
                        record.surNameRu ||
                        record.descriptionEng ||
                        record.descriptionRu ||
                        record.rate ||
                        record.role ||
                        record.bornDate ||
                        record.clinicId ||
                        record.doctorSertificates.length > 0,
                }}
            />

            {/* Add Doctor Modal */}
            <Modal
                title="Yeni Həkim Əlavə Et"
                visible={isAddModalVisible}
                onCancel={handleAddCancel}
                footer={null}
                width={800}
                className="rounded-lg"
            >
                <Form form={form} layout="vertical" onFinish={handleAddDoctor}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="name"
                                label="Həkim Adı (AZ)"
                                rules={[{ required: true, message: "Ad daxil edin!" }]}
                            >
                                <Input
                                    placeholder="Ad daxil edin"
                                    className="rounded-md"
                                />
                            </Form.Item>
                            <Form.Item
                                name="nameEng"
                                label="Həkim Adı (EN)"
                                rules={[{ required: true, message: "Ad daxil edin!" }]}
                            >
                                <Input
                                    placeholder="Ad daxil edin (EN)"
                                    className="rounded-md"
                                />
                            </Form.Item>
                            <Form.Item
                                name="nameRu"
                                label="Həkim Adı (RU)"
                                rules={[{ required: true, message: "Ad daxil edin!" }]}
                            >
                                <Input
                                    placeholder="Ad daxil edin (RU)"
                                    className="rounded-md"
                                />
                            </Form.Item>
                            <Form.Item
                                name="surName"
                                label="Soyad (AZ)"
                                rules={[{ required: true, message: "Soyad daxil edin!" }]}
                            >
                                <Input
                                    placeholder="Soyad daxil edin"
                                    className="rounded-md"
                                />
                            </Form.Item>
                            <Form.Item
                                name="surNameEng"
                                label="Soyad (EN)"
                                rules={[{ required: true, message: "Soyad daxil edin!" }]}
                            >
                                <Input
                                    placeholder="Soyad daxil edin (EN)"
                                    className="rounded-md"
                                />
                            </Form.Item>
                            <Form.Item
                                name="surNameRu"
                                label="Soyad (RU)"
                                rules={[{ required: true, message: "Soyad daxil edin!" }]}
                            >
                                <Input
                                    placeholder="Soyad daxil edin (RU)"
                                    className="rounded-md"
                                />
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
                            <Form.Item
                                name="rate"
                                label="Reytinq"
                                rules={[{ required: true, message: "Reytinq daxil edin!" }]}
                            >
                                <Input
                                    type="number"
                                    step="0.1"
                                    placeholder="Reytinq daxil edin"
                                    className="rounded-md"
                                />
                            </Form.Item>
                            <Form.Item
                                name="role"
                                label="Rol"
                                rules={[{ required: true, message: "Rol daxil edin!" }]}
                            >
                                <Input
                                    placeholder="Rol daxil edin"
                                    className="rounded-md"
                                />
                            </Form.Item>
                            <Form.Item
                                name="bornDate"
                                label="Doğum Tarixi"
                                rules={[{ required: true, message: "Doğum tarixi daxil edin!" }]}
                            >
                                <Input
                                    placeholder="Doğum tarixi daxil edin (məs. 6/24/2004)"
                                    className="rounded-md"
                                />
                            </Form.Item>
                            <Form.Item
                                name="clinicId"
                                label="Klinika"
                                rules={[{ required: true, message: "Klinika seçin!" }]}
                            >
                                <Select
                                    placeholder="Klinika seçin"
                                    className="rounded-md"
                                >
                                    {clinics.map((clinic) => (
                                        <Select.Option key={clinic.id} value={clinic.id}>
                                            {clinic.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="doctorSertificates"
                                label="Sertifikatlar"
                                rules={[{ required: false }]}
                            >
                                <Select
                                    mode="tags"
                                    placeholder="Sertifikat adlarını daxil edin (məsələn, ISO 9001, GMP)"
                                    className="rounded-md"
                                    tokenSeparators={[","]}
                                />
                            </Form.Item>
                            <Form.Item label="Şəkil">
                                <Upload
                                    name="doctorImage"
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
                        <Button
                            onClick={handleAddCancel}
                            className="rounded-md"
                        >
                            İmtina Et
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Edit Doctor Modal */}
            <Modal
                title="Həkim Redaktə Et"
                visible={isEditModalVisible}
                onCancel={handleEditCancel}
                footer={null}
                width={800}
                className="rounded-lg"
            >
                <Form form={editForm} layout="vertical" onFinish={handleEditDoctor}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="name"
                                label="Həkim Adı (AZ)"
                                rules={[{ required: true, message: "Ad daxil edin!" }]}
                            >
                                <Input
                                    placeholder="Ad daxil edin"
                                    className="rounded-md"
                                />
                            </Form.Item>
                            <Form.Item
                                name="nameEng"
                                label="Həkim Adı (EN)"
                                rules={[{ required: true, message: "Ad daxil edin!" }]}
                            >
                                <Input
                                    placeholder="Ad daxil edin (EN)"
                                    className="rounded-md"
                                />
                            </Form.Item>
                            <Form.Item
                                name="nameRu"
                                label="Həkim Adı (RU)"
                                rules={[{ required: true, message: "Ad daxil edin!" }]}
                            >
                                <Input
                                    placeholder="Ad daxil edin (RU)"
                                    className="rounded-md"
                                />
                            </Form.Item>
                            <Form.Item
                                name="surName"
                                label="Soyad (AZ)"
                                rules={[{ required: true, message: "Soyad daxil edin!" }]}
                            >
                                <Input
                                    placeholder="Soyad daxil edin"
                                    className="rounded-md"
                                />
                            </Form.Item>
                            <Form.Item
                                name="surNameEng"
                                label="Soyad (EN)"
                                rules={[{ required: true, message: "Soyad daxil edin!" }]}
                            >
                                <Input
                                    placeholder="Soyad daxil edin (EN)"
                                    className="rounded-md"
                                />
                            </Form.Item>
                            <Form.Item
                                name="surNameRu"
                                label="Soyad (RU)"
                                rules={[{ required: true, message: "Soyad daxil edin!" }]}
                            >
                                <Input
                                    placeholder="Soyad daxil edin (RU)"
                                    className="rounded-md"
                                />
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
                            <Form.Item
                                name="rate"
                                label="Reytinq"
                                rules={[{ required: true, message: "Reytinq daxil edin!" }]}
                            >
                                <Input
                                    type="number"
                                    step="0.1"
                                    placeholder="Reytinq daxil edin"
                                    className="rounded-md"
                                />
                            </Form.Item>
                            <Form.Item
                                name="role"
                                label="Rol"
                                rules={[{ required: true, message: "Rol daxil edin!" }]}
                            >
                                <Input
                                    placeholder="Rol daxil edin"
                                    className="rounded-md"
                                />
                            </Form.Item>
                            <Form.Item
                                name="bornDate"
                                label="Doğum Tarixi"
                                rules={[{ required: true, message: "Doğum tarixi daxil edin!" }]}
                            >
                                <Input
                                    placeholder="Doğum tarixi daxil edin (məs. 6/24/2004)"
                                    className="rounded-md"
                                />
                            </Form.Item>
                            <Form.Item
                                name="clinicId"
                                label="Klinika"
                                rules={[{ required: true, message: "Klinika seçin!" }]}
                            >
                                <Select
                                    placeholder="Klinika seçin"
                                    className="rounded-md"
                                >
                                    {clinics.map((clinic) => (
                                        <Select.Option key={clinic.id} value={clinic.id}>
                                            {clinic.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="doctorSertificates"
                                label="Sertifikatlar"
                                rules={[{ required: false }]}
                            >
                                <Select
                                    mode="tags"
                                    placeholder="Sertifikat adlarını daxil edin (məsələn, ISO 9001, GMP)"
                                    className="rounded-md"
                                    tokenSeparators={[","]}
                                />
                            </Form.Item>
                            <Form.Item
                                name="deleteDoctorSertificates"
                                label="Silinəcək Sertifikatlar"
                                rules={[{ required: false }]}
                            >
                                <Select
                                    mode="tags"
                                    placeholder="Silinəcək sertifikat adlarını daxil edin"
                                    className="rounded-md"
                                    tokenSeparators={[","]}
                                />
                            </Form.Item>
                            <Form.Item label="Şəkil">
                                <Upload
                                    name="doctorImage"
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
                        <Button
                            onClick={handleEditCancel}
                            className="rounded-md"
                        >
                            İmtina Et
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default DoktorTable;